const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const axios = require('axios');
const {Axios} = require("axios");
require("dotenv").config();
//require("./config/database").connect();
// Replace with your Xero Webhook Key
const xero_webhook_key = process.env.WEBHOOK;

// Create a new instance of express
const app = express()
//app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Get the raw body
//app.use(bodyParser.json());

// Set the body parser options
let options = {
    type: 'application/json'
};

// Using the options above, create a bodyParser middleware that returns raw responses.
let itrBodyParser = bodyParser.raw(options);

// Create a route that receives our webhook & pass it our itrBodyParser
app.post('/webhook', itrBodyParser,async function (req, res) {

    console.log("Body: "+req.body.toString());
    console.log("Xero Signature: "+req.headers['x-xero-signature'])
    // Create our HMAC hash of the body, using our webhooks key
    let hmac = crypto.createHmac("sha256", xero_webhook_key).update(req.body.toString()).digest("base64");
    console.log("Resp Signature: " + hmac)
    //Check the request is from xero or not
    if(req.headers['x-xero-signature'] != hmac){
        //send Authentication failed
        console.log("Request is not authorized")
        return res.status(401).send();
    }
    //Verified Request

    const reqBody = JSON.parse(req.body.toString());
    //get Resource Url to parse resources
    const resourceUrl = reqBody["events"][0]["resourceUrl"];
    //get tenant Id
    const tenantId = reqBody["events"][0]["tenantId"];
    console.log(resourceUrl);
    console.log(tenantId);

    //Declare vars to store the data
    let InvoiceID ;
    let DateOfInvoice;
    let GSTInvoiceNo;
    let ClientName;
    let BusinessName;
    let Address = "";
    let EmailAddress;
    let ContactNo = "";
    let Package = "";
    let Quantity;
    let Dateofevent = "";
    let EventName = "";
    let Amount;
    let Paidbycustomer;
    let Packageblocked = "NO";
    let EmailSenttoICC = "NO";
    let EmailReceivedfromICC = "NO";
    let ICCInvoiceNo = "";
    let PaidtoICCbyGST= "";
    let PackageReceivedfromICC= "";
    let TicketFolder="";

    let reqInstance = axios.create({
        headers: {
            'Authorization' :"Bearer " + process.env.ACCESS_TOKEN,
            'xero-tenant-id': tenantId.toString()
        }});
    await reqInstance.get(resourceUrl).then( async (x)=> {
        console.log(x.data['Invoices'][0]);
        for (let xKey in x.data['Invoices']) {
            console.log(xKey);
            InvoiceID = x.data['Invoices'][xKey]['InvoiceID'];
            GSTInvoiceNo = x.data['Invoices'][xKey]['InvoiceNumber'];
            Amount = x.data['Invoices'][xKey]['Total'];
            Paidbycustomer = x.data['Invoices'][xKey]['AmountPaid'];
            Quantity = x.data['Invoices'][xKey]['LineItems'].length;
            DateOfInvoice = x.data['Invoices'][xKey]['DateString'];
            ClientName = x.data['Invoices'][xKey]['Contact']['Name'];
            EmailAddress = x.data['Invoices'][xKey]['Contact']['EmailAddress'];
            BusinessName = x.data['Invoices'][xKey]['ContactID'];
            for (const xKeyKey in x.data['Invoices'][xKey]['Contact']['Addresses']) {
                Address = Address +  x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]["AddressType"]  + ":" + x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]["AddressLine1"]+ " "  + x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]['City'] + " "  + x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]['Region']+ " " + x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]['PostalCode'] + " " + x.data['Invoices'][xKey]['Contact']['Addresses'][xKeyKey]['Country'] + " ";
            }
            for (const xKeyKey in x.data['Invoices'][xKey]['Contact']['Phones']) {
                ContactNo = ContactNo + " " + x.data['Invoices'][xKey]['Contact']['Phones'][xKeyKey]['PhoneNumber'];
            }
            for (const xKeyKey in x.data['Invoices'][xKey]['LineItems']) {
                Package = Package + x.data['Invoices'][xKey]['LineItems'][xKeyKey]['Item']['Name'] + ",";
            }
            console.log("Data Retrieved from Resource URL")
            console.log(InvoiceID);
            console.log(GSTInvoiceNo);
            console.log(Amount);
            console.log(Paidbycustomer);
            console.log(Quantity);
            console.log(DateOfInvoice);
            console.log(ClientName);
            console.log(EmailAddress);
            console.log(BusinessName);
            console.log(Address);
            console.log(ContactNo);
            console.log(Package);
            console.log("Data Done");
            await axios.get(`https://script.google.com/macros/s/AKfycbxQlDgrhXDLuGsGBY7euU7yKrm60Gd42q3yIOPX6rTLr2SoTYFWLoTbg3Mtv8Tsa5P2pg/exec?InvoiceID=${InvoiceID}&DateofInvoice=${DateOfInvoice}&GSTInvoiceNo=${GSTInvoiceNo}&ClientName=${ClientName}&BusinessName=${BusinessName}&Address=${Address}&EmailAddress=${EmailAddress}&Contactno=${ContactNo}&Package=${Package}&Quantity=${Quantity}&Dateofevent=${Dateofevent}&EventName=${EventName}&Amount=${Amount}&Paidbycustomer=${Paidbycustomer}&Packageblocked=${Packageblocked}&EmailSenttoICC=${EmailSenttoICC}&EmailReceivedfromICC=${EmailReceivedfromICC}&ICCInvoiceNo=${ICCInvoiceNo}&PaidtoICCbyGST=${PaidtoICCbyGST}&PackageReceivedfromICC=${PackageReceivedfromICC}&TicketFolder=${TicketFolder}`).then((x)=>{console.log(x); } ).catch((e)=> {console.log(e)});
        }
        }).catch(err => console.log(err));
       // Get New access Token By using Refresh Token

    // POST https://identity.xero.com/connect/token
    //     authorization: "Basic " + base64encode(client_id + ":" + client_secret)
    // Content-Type: application/x-www-form-urlencoded
    //
    // grant_type=refresh_token
    // &refresh_token=xxxxxx

    // URL to get Refresh token (This Needed in every 60 days to refresh Access Tokens)
     //https://login.xero.com/identity/connect/authorize?response_type=code&client_id=6BB9EA65ED8A4332BA44FBBCB5D1656C&redirect_uri=http://localhost&scope=accounting.transactions offline_access
    //Url of APP script To add data to Google Sheet
   // https://script.google.com/macros/s/AKfycbxQlDgrhXDLuGsGBY7euU7yKrm60Gd42q3yIOPX6rTLr2SoTYFWLoTbg3Mtv8Tsa5P2pg/exec?InvoiceID=Invoice1213&DateofInvoice=12&GSTInvoiceNo=4324&ClientName=Premchand&BusinessName=Prem&Address=Bikaner&EmailAddress=Premchand&Contactno=8384909995&Package=3&Quantity=23&Dateofevent=342&EventName=New&Amount=43&Paidbycustomer=43&Packageblocked=43&EmailSenttoICC=yes&EmailReceivedfromICC=43&ICCInvoiceNo=dsaf&PaidtoICCbyGST=43&PackageReceivedfromICC=yes&TicketFolder=yes
    res.status(200).send();
})
module.exports = app;