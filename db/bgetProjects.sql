select p.id, p.name, g.id as groupid from project_members pm
join projects p on p.id = pm.project_id
join groups g on g.id = p.group_id
where pm.user_id = $1;