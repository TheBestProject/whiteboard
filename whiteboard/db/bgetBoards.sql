select w.id, w.name, w.canvas, p.id as projectid, g.id as groupid from whiteboards w
join projects p on p.id = w.project_id
join project_members pm on p.id = pm.project_id
join groups g on g.id = p.group_id
where pm.user_id = 1;