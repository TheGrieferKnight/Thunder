import { useQuery } from "@tanstack/react-query";
import { commands } from "../bindings";

export function useTierlistChampions(enabley: boolean) {
  return useQuery({
    enabled: enabley,
    queryKey: ['tierlistChampions'],
    queryFn: () => commands.runUncheckedDbQuery(`WITH
  total_matches AS (
    SELECT
      COUNT(*) AS total_count
    FROM
      match_info
  ),
  champion_stats AS (
    SELECT
      champion_name,
      COUNT(match_id) AS matches_played,
      round(AVG(win::INT) * 100, 2) AS win_rate
    FROM
      participants
    GROUP BY
      champion_name
  )
SELECT
  p.champion_name,
  p.matches_played,
  p.win_rate,
  round((p.matches_played * 100.0 / t.total_count), 2) AS play_rate,
  t.total_count
FROM
  champion_stats p,
  total_matches t
ORDER BY
  play_rate DESC;`)
  });
}



export function useItemTierlist(champion: string) {
  return useQuery({
    queryKey: ['tierlistChampions', champion],
    queryFn: () => commands.runUncheckedDbQuery(`WITH
  caitlyn_games AS (
    SELECT
      match_id,
      puuid,
      win,
      CASE
        WHEN item0 > 3000 THEN item0
        WHEN item1 > 3000 THEN item1
        ELSE item0
      END AS first_major_item_id
    FROM
      participants
    WHERE
      champion_name = '${champion}'
      AND time_played > 600
  )
SELECT
  first_major_item_id,
  COUNT(*) AS games_played,
  ROUND(
    AVG(
      CASE
        WHEN win THEN 1.0
        ELSE 0.0
      END
    ) * 100,
    2
  ) AS win_rate_percentage
FROM
  caitlyn_games
WHERE
  first_major_item_id > 0
  AND first_major_item_id NOT IN (2003, 2055, 1055, 1054, 1083)
GROUP BY
  first_major_item_id
HAVING
  games_played > 10
ORDER BY
  games_played DESC;`),
    enabled: !!champion,
  });
}
