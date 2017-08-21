select 
distinct
projects.id as projectid,
groups.id as groupid,
whiteboards.id,
whiteboards.name,
whiteboards.canvas
from project_members 
join projects on projects.id = project_members.project_id
join users on users.id = project_members.user_id
join groups on projects.group_id = groups.id
join whiteboards on whiteboards.project_id = projects.id
where users.id = $1