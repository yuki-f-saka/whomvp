CREATE OR REPLACE FUNCTION get_vote_results(p_group_id UUID)
RETURNS JSON
AS $$
DECLARE
    result JSON;
BEGIN
    WITH
    members_in_group AS (
      SELECT id, name FROM members WHERE group_id = p_group_id
    ),
    votes_in_group AS (
      SELECT ranked_members, id FROM votes WHERE group_id = p_group_id
    ),
    points_per_member AS (
      SELECT
          (ranking.member_id)::UUID AS member_id,
          SUM(ranking.rank) AS total_points
      FROM
          votes_in_group,
          jsonb_to_recordset(ranked_members) AS ranking(member_id TEXT, rank INT)
      GROUP BY
          (ranking.member_id)::UUID
    ),
    aggregated_results AS (
      SELECT
          m.id AS "memberId",
          m.name AS "memberName",
          COALESCE(p.total_points, 0) AS "points"
      FROM
          members_in_group m
      LEFT JOIN
          points_per_member p ON m.id = p.member_id
      ORDER BY
          "points" ASC
    )
    SELECT
        json_build_object(
            'results', COALESCE(json_agg(ar.*), '[]'::json),
            'totalMembers', (SELECT COUNT(*) FROM members_in_group),
            'votedCount', (SELECT COUNT(*) FROM votes_in_group)
        )
    INTO
        result
    FROM
        aggregated_results ar;

    RETURN result;
END;
$$ LANGUAGE plpgsql;