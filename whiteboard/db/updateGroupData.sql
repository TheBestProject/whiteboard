update groups
set name = $1
where id = $2
returning *;