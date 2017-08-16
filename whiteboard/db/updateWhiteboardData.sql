update whiteboards
set image_data = $1
where id = $2
returning *;