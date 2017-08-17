select 
auth0_id,
name as username,
email,
profilepic from users
where auth0_id = $1

