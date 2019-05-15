import Octokit from '@octokit/rest'
const fetchData = (req, res) => {
    const url = req.query.url || [];
    console.log("url", url);
    var org= null, repo = null;

    //get org and repo names from git url
    if(url) {
        if(url.indexOf("http") == 0) {
            const urlArr = url.split('/');
            org = urlArr.length > 3 ? urlArr[3] : null;
            repo = urlArr.length > 4 ? urlArr[4] : null;
        } else {
            const urlArr = url.split('/');
            org = urlArr.length > 1 ? urlArr[1] : null;
            repo = urlArr.length > 2 ? urlArr[2] : null;
        }
    }

    //Creating Octait Object
    const octokit = new Octokit({
        userAgent: 'myApp v1.2.3',
        baseUrl: 'https://api.github.com',
    })

    //getting all issues with org and repo name
    octokit.request(`GET /repos/${org}/${repo}/issues`).then(result => {
        var totalIssues = 0;
        var noOfIssueIn24Hrs = 0;
        var noOfIssueIn7Days = 0;
        var time24HrsBack = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
        var time7DaysBack = new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000);

        //Iterating the issues list and updating the issues by age bucket
        result.data.forEach(issue => {
            //Check if it is a issue not a pull request
            if(!issue.pull_request) {
                totalIssues = totalIssues + 1;
                const issueDate = new Date(issue.created_at);
                if(issueDate.getTime() > time24HrsBack.getTime()) {
                    noOfIssueIn24Hrs = noOfIssueIn24Hrs + 1;
                } else if(issueDate.getTime() > time7DaysBack.getTime()) {
                    noOfIssueIn7Days = noOfIssueIn7Days + 1;
                }
            }
        });

        //sending response to frontend
        res.send({
            totalIssues,
            noOfIssueIn24Hrs,
            noOfIssueIn7Days,
            noOfIssueAfter7Days: totalIssues - (noOfIssueIn24Hrs + noOfIssueIn7Days)
        })
    }).catch((e) => {
        console.log("Error fetching issue from github api, ", e);
        res.status(400).json({message: 'Error fetching issue from github api'});
    });
}

export const service = {
    fetchData,
}