async function getRepofiles(owner,repo){
    const url=`https://api.github.com/repos/${owner}/${repo}/contents`;
    const data=await fetch(url);
    const response=await data.json();  
    return response;
}

// what is the use of this getfilecontent function
async function getFileContent(fileUrl) {
    const response=await fetch(fileUrl);
    return await response.text()
}

module.exports={getRepofiles,getFileContent};