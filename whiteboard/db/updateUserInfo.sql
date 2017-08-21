update users
set name = $1,
profilepic = $2
where id = $3
returning *;