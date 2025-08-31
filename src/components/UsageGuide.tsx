import styles from '@/app/styles/common.module.css';

const UsageGuide = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>使い方</h2>
      <div className={styles.card}>
        <h3 className={styles.subtitle}>投票までの流れ</h3>
        <ol className={styles.list}>
          <li className={styles.listItem}><strong>1. グループ作成</strong><p>トップページから「グループを作成」ボタンを押し、新しいグループを作ります。</p></li>
          <li className={styles.listItem}><strong>2. メンバー追加</strong><p>作成したグループに、投票に参加するメンバーの名前を追加します。</p></li>
          <li className={styles.listItem}><strong>3. 投票ページの共有</strong><p>メンバーに投票ページのURLを共有します。</p></li>
          <li className={styles.listItem}><strong>4. 投票</strong><p>各メンバーは、共有されたページで自分の名前を選択し、投票を行います。他メンバーの順位をスワイプで決定してください。</p></li>
          <li className={styles.listItem}><strong>5. 結果発表</strong><p>全員の投票が終わったら、結果ページでMVPを確認できます。</p></li>
        </ol>
      </div>
    </div>
  );
};

export default UsageGuide;
