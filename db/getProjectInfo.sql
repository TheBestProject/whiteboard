select 
id,
name,
group_id as groupid
from projects where id = $1
order by id