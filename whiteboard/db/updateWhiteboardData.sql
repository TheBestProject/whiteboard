update whiteboards
set canvas = $1
where id = $2
returning *;