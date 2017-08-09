insert into group_members(group_id, user_id)
values ($1, $2)
returning *;