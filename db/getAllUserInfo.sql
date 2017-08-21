select distinct
users.id,
users.name as username,
email,
profilepic,
group_members.group_id as groupid,
project_members.project_id as projectid
from users
join group_members on users.id = group_members.user_id
join groups on groups.id = group_members.group_id
join projects on projects.group_id = groups.id
join project_members on projects.id = project_members.project_id
where users.id = $1
order by groupid



-- updated to call back all user info with whiteboards attached each additional canvas adds ~ 60ms load
-- select distinct
-- users.id,
-- group_members.group_id as groupid,
-- project_members.project_id as projectid,
-- whiteboards.id,
-- whiteboards.name,
-- whiteboards.canvas
-- from users
-- join group_members on users.id = group_members.user_id
-- join groups on groups.id = group_members.group_id
-- join projects on projects.group_id = groups.id
-- join project_members on projects.id = project_members.project_id
-- join whiteboards on whiteboards.project_id = projects.id
-- where users.id = $1
-- order by whiteboards.id