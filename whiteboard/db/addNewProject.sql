insert into projects(group_id, name)
values ($1, $2)
returning *;