# Visualization Ideas

Brainstormed visualizations for the GymRoster UI, organized by theme. Some are buildable now with existing data; others unlock as more data (team rosters, meet scores) becomes available.

## Status key

- **Now** — existing athlete, coach, and college data is sufficient
- **Roster** — requires Team Roster CRUD to be implemented
- **Scores** — requires meet score data

---

## Coaching

| Visualization                     | Type           | Status | Description                                                                                                                                              |
| --------------------------------- | -------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Coach tenure timeline             | Horizontal bar | Roster | One bar per coach per program, colored by role (head vs. assistant). Shows gaps (vacancy years), overlaps (transition periods), and coaching continuity. |
| Staff turnover rate by conference | Bar / heatmap  | Roster | Average coaching changes per season grouped by conference. Identifies volatile vs. stable conferences.                                                   |
| Head coach tenure distribution    | Histogram      | Roster | How long do head coaches last across all programs? Split by division (D1/D2/D3).                                                                         |
| Coaching carousel                 | Sankey / chord | Roster | Flow of coaches moving between programs. Answers "where do coaches come from / go to?"                                                                   |

---

## Athlete Retention & Attrition

| Visualization                     | Type         | Status | Description                                                                                                                                                              |
| --------------------------------- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Cohort retention funnel           | Funnel       | Roster | Take all athletes who were FR in season X; track how many appear as SO, JR, SR in subsequent seasons. Per school or conference.                                          |
| One-and-done rate per program     | Bar (ranked) | Roster | % of athletes who appear in exactly one season's roster. High rate may indicate transfers, injuries, cuts, or walk-on turnover.                                          |
| Roster experience index over time | Line         | Roster | Assign FR=1, SO=2, JR=3, SR=4; average per team per season. Shows whether a team is rebuilding (young) or veteran-heavy. Interesting to correlate with coaching changes. |

---

## Geography

| Visualization                    | Type            | Status | Description                                                                                                   |
| -------------------------------- | --------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| Athlete origin choropleth        | US heatmap      | Now    | States shaded by athlete count. Filterable by conference, division, or school to show recruiting territory.   |
| State-to-school flow             | Sankey          | Now    | Pick a state → see which schools recruit from it. Or pick a school → see which states its athletes come from. |
| Top feeder states per conference | Small multiples | Now    | One mini bar chart per conference showing its top 5 origin states. Reveals regional concentration patterns.   |

---

## Club Pipeline

| Visualization              | Type       | Status | Description                                                                                     |
| -------------------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------- |
| Top clubs by athlete count | Bar        | Now    | Filterable by season. Directly shows which clubs produce the most college athletes.             |
| Club-to-school matrix      | Heatmap    | Now    | Clubs on one axis, schools (or conferences) on the other. Identifies feeder-club relationships. |
| Club geographic spread     | Bubble map | Now    | Bubble size = number of athletes produced. Shows whether top clubs cluster in certain states.   |

---

## Program / Team Analysis

| Visualization                            | Type    | Status          | Description                                                                                                    |
| ---------------------------------------- | ------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| Roster size trends                       | Line    | Roster          | Per-team roster size over seasons. Shows whether programs expand or contract; compare to conference averages.  |
| Conference depth: experience vs. results | Scatter | Roster + Scores | x = average roster experience index, y = average score. Tests whether veteran rosters outperform younger ones. |

---

## Scores (future)

| Visualization                | Type     | Status          | Description                                                                                                    |
| ---------------------------- | -------- | --------------- | -------------------------------------------------------------------------------------------------------------- |
| Score trends                 | Line     | Scores          | Per-team score across seasons. The foundational score chart.                                                   |
| Score vs. coaching tenure    | Scatter  | Roster + Scores | x = years current head coach has been at program, y = average score. Tests whether stability leads to results. |
| Score vs. attrition rate     | Scatter  | Roster + Scores | x = one-and-done %, y = team score. Do teams that retain athletes perform better?                              |
| Conference parity over time  | Box plot | Scores          | Spread of scores within a conference per season. Is one conference dominant? Is parity increasing?             |
| Home/away score differential | Bar      | Scores          | Requires meet location data.                                                                                   |

---

## Priority picks for the near term

Given current data availability:

1. **Athlete origin choropleth** — visually impressive, data is already there, immediately useful
2. **Top feeder clubs bar chart** — simple to build, directly answers a clear question
3. **Cohort retention funnel** — analytically interesting once Roster CRUD is done
4. **Coach tenure timeline per program** — tells a story about program stability once Roster CRUD is done

The score-correlation charts (tenure vs. score, attrition vs. score) are the most analytically rich — worth keeping the data model in mind for them even before they're built.
