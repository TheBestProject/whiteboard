select distinct g.id, g.name from group_members gm
join groups g on g.id = gm.group_id
where gm.user_id = $1;