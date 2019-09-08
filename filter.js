fetch('https://data-endpoint.herokuapp.com/data')
    .then((resp) => resp.json())
    .then(function(data){
        data.forEach(filterData);
        console.log(data);
        saveFile(data);
    })
    .catch(function(){
        console.log('There has been and error');
    });
function filterData(item, index) {

    if(item.hasOwnProperty('firstName') && item.firstName !== null && item.firstName !== '') {
        let tempFirstName = item['firstName'].split(' ');
        if(tempFirstName.length > 1) {
            if(!item.hasOwnProperty('lastName') || item.lastName === null || item.lastName === '') {
                item.firstName = tempFirstName[0];
                item.lastName = tempFirstName[1];
            }
        }
    }else{
        item.firstName = 'N/A'
    }
    if(item.hasOwnProperty('lastName') && item.lastName !== null && item.lastName !== '') {
        let tempFirstName = item['lastName'].split(' ');
        if(tempFirstName.length > 1) {
            if(!item.hasOwnProperty('firstName') || item.firstName === null || item.firstName === '' || item.firstName === 'N/A') {
                item.firstName = tempFirstName[0];
                item.lastName = tempFirstName[1];
            }
        }
    }else{
        item.lastName = 'N/A'
    }
    if(item.hasOwnProperty('phone')) {
        if(typeof item.phone != 'string') {
            item.phone = String(item.phone);
            if(item.phone.length === 10) {
                item.phone = item.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
            }else {
                item.phone = 'N/A';
            }
        }
    }else{
        item.phone = 'N/A'
    }
    if(item.hasOwnProperty('email')) {
        if(!validateEmail(item.email)) {
            item.email = 'N/A'
        }
    }else{
        item.email = 'N/A'
    }
}

function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function saveFile(data) {
    var json = JSON.stringify(data);
    var file = new File([json], "ns8-testFile.txt", {type: "application/octet-stream"});
    var blobUrl = (URL || webkitURL).createObjectURL(file);
    window.location = blobUrl;
}
