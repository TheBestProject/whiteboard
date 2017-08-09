update users
set name = $1, set profilepic = $2
where id = $3
returning *;