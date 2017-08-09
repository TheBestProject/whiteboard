select 
id,
name as username,
email,
profilepic from users
where id = $1