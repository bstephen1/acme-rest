To run in a docker container:

docker build -t <image-name> . 
docker images (note image id for the image name from above)
docker run -p 8080:8080 <image-id>


There is one example record hardcoded with record id = 1
exampleProfile.json is an example JSON file that can be used for creating a new profile

supported operations: 

get a profile, given profile id: profiles/<id>
    eg: http://localhost:8080/profiles/1
create a profile: post with the profile as the data
    eg: curl -X POST -H "Content-Type: application/json" -d  @exampleProfile.json http://localhost:8080/profiles

