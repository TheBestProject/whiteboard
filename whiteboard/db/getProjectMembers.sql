select users.id as userid,
users.name as username,
projects.id as projectid,
projects.name as projectname,
groups.id as groupid,
groups.name as groupname
from project_members 
join projects on projects.id = project_members.project_id
join users on users.id = project_members.user_id
join groups on projects.group_id = groups.id
where projects.id = $1