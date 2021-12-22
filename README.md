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


=============

functions completed: completed all core functionality, but there is no testing and minimal handling of edge cases 

potential issues: 
-no automated testing -- should add some tests to confirm the functionality is working as expected
-data validation -- bad input should be guarded against and added to the tests. Eg, non valid ID in the get request, non valid post data, non valid lat/lon coordinates
-errors from weather api -- there's nothing checking if the weather api is throwing an error or that the lat/lon values are valid
-there's a long chain of promises to get the temperature from the weather api. There might be a better way to do that but I didn't have time to look into that any more. 
-not using a database -- I was going under the assumption that this would be hooked into an existing production database so currently it's just saving profiles to a variable in server.js. If so there should be utilities to save / query from the database which can be swapped in.
-it seems cumbersome to have users use lat/lon coordinates to input a profile. I'd think this would work best with a UI component with a world map where users can select a location visually rather than having to input the coordinates themselves. 

security limitations: 
-since this is public facing there should be a lot of scrutiny on the create profile command to protect what gets entered into the database, and on the get request that sensitive data isn't leaked since anyone who knows the profile id can query it
-There could be some concerns interfacing with the weather API since that's controlled by a third party, so it could be a potential attack vector or expose some data about requests
-Also the security concerns of not having any testing which makes it more likely for some kind of flaw to exist that can be exploited