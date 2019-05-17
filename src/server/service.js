const fetchData = (req, res, octokit) => {
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
    
      
    const response = {
        totalIssues : 0,
        noOfIssueIn24Hrs: 0,
        noOfIssueIn7Days: 0,
        noOfIssueAfter7Days: 0,
    };
    var promiseArr = [];
    var pageNo = 1;
    var pageSize = 500;
    // const octokit = new Octokit({
    //     userAgent: 'myApp v1.1',
    //     baseUrl: 'https://api.github.com',
    // })
    while(pageNo <= 50){
        promiseArr.push(fetchIssuesWithPagination(octokit, org, repo, pageNo, pageSize));
        pageNo = pageNo + 1;
    }
    Promise.all(promiseArr).then((result) => {
        result.forEach(resultItem => {
            response.totalIssues = response.totalIssues + resultItem.totalIssues;
            response.noOfIssueIn24Hrs = response.noOfIssueIn24Hrs + resultItem.noOfIssueIn24Hrs;
            response.noOfIssueIn7Days = response.noOfIssueIn7Days + resultItem.noOfIssueIn7Days;
            response.noOfIssueAfter7Days = response.noOfIssueAfter7Days + resultItem.noOfIssueAfter7Days;
        })
        res.send(response);
    }).catch((e) => {
        res.status(400).json({message: 'Error fetching issue from github api'});
    })
   
}

var fetchIssuesWithPagination = function(octokit, org, repo, pageNo, pageSize) {
    return new Promise((resolve, reject) => {
        //getting all issues with org and repo name
        console.log("url", `GET /repos/${org}/${repo}/issues?page=${pageNo}&per_page=${pageSize}`);
        octokit.request(`GET /repos/${org}/${repo}/issues?page=${pageNo}&per_page=${pageSize}`).then(result => {
            var totalIssues = 0;
            var noOfIssueIn24Hrs = 0;
            var noOfIssueIn7Days = 0;
            var time24HrsBack = new Date(new Date().getTime() - 60 * 60 * 24 * 1000);
            var time7DaysBack = new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000);
            result = result.data.map(issue => ({created_at: issue.created_at, pull_request: issue.pull_request}))
            //Iterating the issues list and updating the issues by age bucket
            result.forEach(issue => {
                //Check if it is a issue not a pull request
                if(true) {
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
            resolve({
                totalIssues,
                noOfIssueIn24Hrs,
                noOfIssueIn7Days,
                noOfIssueAfter7Days: totalIssues - (noOfIssueIn24Hrs + noOfIssueIn7Days),
                pageNo
            })
        }).catch((e) => {
            console.log("Error fetching issue from github api, ", e);
            reject("Error fetching issue from github api");
        });
    })
     
}

export const service = {
    fetchData,
}