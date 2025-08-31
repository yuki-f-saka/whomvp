CREATE OR REPLACE VIEW public.members_with_vote_status AS
SELECT
    m.id,
    m.name,
    m.group_id,
    CASE
        WHEN v.voter_id IS NOT NULL THEN TRUE
        ELSE FALSE
    END AS has_voted
FROM
    public.members m
LEFT JOIN
    (SELECT DISTINCT group_id, voter_id FROM public.votes) v
ON
    m.id = v.voter_id AND m.group_id = v.group_id;
