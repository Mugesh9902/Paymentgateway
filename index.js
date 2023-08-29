import React, { useEffect, useRef } from "react";
import Header from "./Header";
import { Button } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import apiService from "../core/service/detail";
import { postMethod } from "../core/service/common.api";
import { getMethod } from "../core/service/common.api";
import "semantic-ui-css/semantic.min.css";
import { Dropdown, Loader, Input } from "semantic-ui-react";
import useState from "react-usestateref";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { IconSquareRoundedCheck } from '@tabler/icons-react';
function Home() {
    const navigate = useNavigate();
    const initialFormValue = { email: "", payid: "", otp: "", };
    const [modal, setModal] = useState(false);
    const [formValue, setFormValue] = useState(initialFormValue);
    const [emailErr, SetemailErr, emailErrref] = useState(false);
    const [payidErr, SetpayidErr, payidErrref] = useState(false);
    const [fromTab, setFromTab] = useState([]);
    const [toTab, setToTab] = useState([]);
    const [fromCurrency, setfromCurrency, fromref] = useState("ADVB");
    const [toCurrency, settoCurrency, toref] = useState("USDT");
    const [appendFromData, setappendFromData, appendFromDataref] = useState("");
    const [appendToData, setappendFToData, appendToDataref] = useState("");
    const [fromcurrencyImage, setFromcurrencyImage] = useState("");
    const [tocurrencyImage, setTocurrencyImage] = useState("");
    const [ButtonLoader, setButtonLoader] = useState(false);
    const [loader, Setloader] = useState(false);
    const [donateamount, SetDonateamount] = useState(false);
    const [checkloader, setcheckLoader] = useState(false);
    const [allCurrencyFiat, setfromCurrencyRef, fromCurrencyRef] = useState([]);
    const [toCurrencyRefs, setToCurrencyRef, toCurrencyRef] = useState([]);
    const [advbprice, setadvbPrice, advbpriceref] = useState(0);
    const [advbnewprice, setadvbnewPrice, advbnewpriceref] = useState(0);
    const [button, setbutton] = useState("");
    const [Checkoutdetails, SetCheckoutdetails, Checkoutdetailsref] = useState([]);
    const [validationErr, setValidationErr] = useState({});
    const [formValues, setFormValues] = useState({});
    const [process, Setprocess] = useState(true);
    const [pay, Setpay] = useState(false);
    const [validationnErr, setvalidationnErr] = useState("");
    const [submit, Setsubmit] = useState(false);
    const [customer, Setcustomer, customerref] = useState("");
    const [fromcurrency, Setfromcurrency, fromcurrencyref] = useState("");
    const [tocurrency, Settocurrency, tocurrencyref] = useState("");
    const [totalamount, Settotalamount, totalamountref] = useState("");
    const [currency, setCurrency] = useState("");
    const [currencyErr, setCurrencyErr, setCurrencyErrref] = useState(false);
    const { payid, email, otp, } = formValue;
    const toggle = () => setModal(!modal);
    const goto = () => navigate("/");
    useEffect(() => {
        getUserbalance();
        var link = window.location.href.split("/")[4];
        console.log(link);
        checkoutdetails(link);
    }, [0]);
    const Proceed = () => {
        validate(formValue);
        console.log(currency, "setCurrencyErrref")
        Setfromcurrency(Checkoutdetails.currency);
        Settocurrency(currency)
        if (currency != "") {
            const apiUrl = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fromcurrencyref.current}&tsyms=${tocurrencyref.current}&api_key=93e3c5b6fe23291d2114acf508c57635e90100074cf42266f20cd231e5f8e854`;
            setButtonLoader(true)
            axios.get(apiUrl)
                .then((response) => {
                    if (response.data.Response != "Error") {
                        console.log(response, "response")
                        var value = response.data[fromcurrencyref.current][tocurrencyref.current];
                        console.log(value, "value")
                        var total = value * Checkoutdetails.Fixed;
                        Settotalamount(total);
                        console.log(totalamountref.current)
                        setButtonLoader(false)
                        Setpay(true);
                        Setprocess(false);
                        SetemailErr(false);
                        SetpayidErr(false);
                    } else { toast.error("This Currency Cannot Working"); }
                }).catch((error) => {
                    console.error("An error occurred:", error);
                    toast.error("Something Went Wrong")
                });
        } else { console.log("please select the currency") }
    }

    const Pay = async () => {
        validate(formValue);
        if (payidErrref.current == false && emailErrref.current == false) {
            var data = {
                apiUrl: apiService.verifycustomer,
                payload: formValue,
            }; setButtonLoader(true)
            var resp = await postMethod(data);
            setButtonLoader(false)
            if (resp.status == true) {
                Setpay(false);
                Setsubmit(true);
                Setcustomer(resp.customername)
                toast.success(resp.Message)
            } else { toast.error(resp.Message) }
        } else { console.log("Something Went Wrong") }
    }

    const getUserbalance = async () => {
        Setloader(true);
        var data = { apiUrl: apiService.getUserBalanceSwap, };
        var resp = await getMethod(data);
        if (resp.status) {
            Setloader(false);
            setFromTab(resp.data);
            setToTab(resp.data);
            var currArrayFiat = [{ value: "all", label: "" }];
            var data = resp.data;
            for (var i = 0; i < data.length; i++) {
                var obj = {
                    value: data[i].currid,
                    key: data[i].currencySymbol,
                    text: data[i].currencySymbol,
                    image: {
                        avatar: true,
                        src: data[i].image,
                    },
                };
                currArrayFiat.push(obj);
            }
            console.log(currArrayFiat);
            setToCurrencyRef(currArrayFiat);
            setfromCurrencyRef(currArrayFiat);
            console.log("resp.data[0]===", resp.data);
            console.log("resp.data[5]===", resp.data[4]);
            setappendFromData(resp.data[1]);
            setFromcurrencyImage(resp.data[1].image);
            setfromCurrency(resp.data[1].currencySymbol);
            settoCurrency(resp.data[2].currencySymbol);
            setappendFToData(resp.data[2]);
            setTocurrencyImage(resp.data[2].image);
        } else { }
    };
    const handleOnChange_to = (e, data) => {
        var findIndexingTo = fromTab.findIndex((x) => x.currid == data.value);
        if (findIndexingTo != -1) {
            settoCurrency(fromTab[findIndexingTo].currencySymbol);
            setappendFToData(fromTab[findIndexingTo]);
            setTocurrencyImage(fromTab[findIndexingTo].image);
        }
    };
    const checkoutdetails = async (link) => {
        try {
            Setloader(true);
            var obj = { link: link, }
            var data = {
                apiUrl: apiService.checkoutdetails,
                payload: obj,
            };
            var resp = await postMethod(data);
            console.log("getmerchantdetails===", resp);
            if (resp) {
                Setloader(false);
                console.log(resp.obj, "=-=-respobj-=-=");
                console.log(resp, "-=-=-resp=-=-=-resp==-resp");
                SetCheckoutdetails(resp.obj);
            } else { console.log(resp, "-=-=-resp=-=-=-resp==-resp"); }
        } catch (error) { console.log(error, "=-=error=-=-="); }
    };

    const handleChange = async (e) => {
        console.log("e====", e);
        e.preventDefault();
        const { name, value } = e.target;
        let formData = { ...formValue, ...{ [name]: value } };
        console.log("formData====", formData);
        setFormValue(formData);
    };
    const validate = async (values) => {
        const errors = {};
        if (currency == "") {
            errors.currency = "Currency is required !";
            setCurrencyErr(true);
        } else { setCurrencyErr(false); }
        if (values.email == "") {
            errors.email = "email is required !";
            SetemailErr(true);
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = "Invalid email address";
            SetemailErr(true);
        }
        else { SetemailErr(false); }
        if (values.payid == "") {
            errors.payid = "payid is required !";
            SetpayidErr(true);
        }
        else if (values.payid.length < 10 || values.payid.length > 13
        ) {
            errors.payid = "Invalid Payment ID";
            SetpayidErr(true);
        }
        else { SetpayidErr(false); }
        setvalidationnErr(errors);
        return errors;
    };
    const onSelect = async (option) => {
        console.log(option.target.outerText, "target");
        setCurrency(option.target.outerText);
    };

    const formSubmit = async () => {
        if (formValue.otp != "") {
            formValue["productname"] = Checkoutdetails.Name;
            formValue["currency"] = currency;
            formValue["amount"] = totalamountref.current;
            formValue["customer"] = customerref.current;
            formValue["merchant"] = Checkoutdetails.userId;
            var data = {
                apiUrl: apiService.productotp,
                payload: formValue,
            };
            var resp = await postMethod(data);
            if (resp.status == true) {
                toast.success("Payment Successfully")
                setModal(!modal)
                Setsubmit(false);
            } else { toast.error(resp.Message) }
        } else { toast.error("Enter OTP"); }
    };


    return (
        <div className="header">
            <div className="">
                <div className="css-1o43t2y">
                    <div className="css-1h690ep">
                        <main className="main_heinght">
                            {loader == true ? (
                                <div class="spinner css-ezm1fk">
                                    <div class="css-1qoumk2"></div>
                                    <div class="css-1v19680"></div>
                                    <div class="css-1v90jie"></div>
                                    <div class="css-19p0rvp"></div></div>) : (<>{Checkoutdetails.Fixed != null ? (
                                        <section className="section_projec bg_trrrr w-100">
                                            <div className="container">
                                                <div className="row justify-content-center mt-5">
                                                    {process == true ? <><div className="col-lg-4 ">
                                                        <div className="widget_content border topbg rounde-9 shadow">
                                                            <div className="widgettop pt-5">
                                                                <div width="100%"><img width="20%" src={Checkoutdetails.Logourl} className="widgetimage mx-auto d-block" /></div>
                                                                <div className=" text-center pt-4"><h6 className="h3">{Checkoutdetails.Name}</h6>
                                                                    <p>{Checkoutdetails.Description}</p><p className="h5 pt-4">Total Amount</p>
                                                                    <p className="h3 pt-2 pb-5 text-white"> {Checkoutdetails.Fixed} {Checkoutdetails.currency}</p>
                                                                    <h6 className="h5 pt-2">Secured By Beleaf</h6></div></div>
                                                            <div className="widgetbottom">
                                                                <div className="px-4">
                                                                    <div className="coin_select">
                                                                        <h5 className="heading_class_h5 px-2 pt-4 pb-2">Select currencies</h5>
                                                                        <Dropdown className="shadow" placeholder="Select currencies" fluid selection options={toCurrencyRef.current}
                                                                            onChange={onSelect} /></div><div>
                                                                        {setCurrencyErrref.current == true ? (<p className="text-danger">{validationnErr.currency}</p>) : ("")}</div>
                                                                    {ButtonLoader == false ? (<Button className="swap_but newbutton" onClick={Proceed}>Proceed{button}</Button>) : (
                                                                        <Button className="swap_but newbutton" disabled>Loading....</Button>)}</div></div></div></div></> : null}
                                                    {pay == true ?
                                                        <div className="col-lg-4">
                                                            <div className="widget_content border rounde-9 shadow">
                                                                <div className="widget2top bg_5445ed d-flex flex-row p-2">
                                                                    <img width="15%" src={Checkoutdetails.Logourl} className="widgetimage" />
                                                                    <div className=" text-center pt-3 pl-4 text-white"><h6 className="h5">{Checkoutdetails.Name}</h6></div></div>
                                                                <div className="widget2bottom">
                                                                    <div className="px-4">
                                                                        <h5 className="heading_class_h5 px-2 text-center pt-3">Personal Information</h5>
                                                                        <div className="pt-5">
                                                                            <h5 className="heading_class_h5 px-2 pt-2">Email</h5>
                                                                            <Input placeholder="Enter Your Email" type="text" className="w-100 inputwidth" value={email} name="email" onChange={handleChange} />
                                                                            <div>{emailErrref.current == true ? (<p className="text-danger mt-2">{validationnErr.email}</p>) : ("")}</div>
                                                                            <h5 className="heading_class_h5 px-2 pt-2">Payment ID</h5>
                                                                            <Input placeholder="Enter Your Pay ID" type="text" className="w-100 pb-2 inputwidth" value={payid} name="payid" onChange={handleChange} />
                                                                            <div>{payidErrref.current == true ? (<p className="text-danger mb-2">{validationnErr.payid}</p>) : ("")}
                                                                            </div>
                                                                            <table className="table borderless responsive">
                                                                                <tr><th className="h6 px-2 pt-4">Selected Currency </th><th className="h6 px-2 pt-4">: {currency} </th></tr>
                                                                                <tr><th className="h6 px-2 pt-2 pl-3">Total Amount </th><th className="h6 px-2 pt-2 pl-3"> : {(totalamountref.current).toFixed(6)} {currency} </th></tr></table></div></div></div>
                                                                <div className="mx-3">
                                                                    {ButtonLoader == false ? (<Button className="swap_but newbutton mt-5" onClick={Pay}>Pay Now{button}</Button>
                                                                    ) : (<Button className="swap_but newbutton mt-5" disabled>Loading...</Button>)}</div></div></div> : null}
                                                    {submit == true ? <>
                                                        <div className="col-lg-4">
                                                            <div className="widget_content border rounde-9 topbg shadow">
                                                                <div className="widget3top p-2">
                                                                    <div className="pt-5 text-white">
                                                                        <div className="text-center">
                                                                            <h5 className="h5 px-3 pt-5">Email : mugesh9902@gmail.com</h5>
                                                                            <h5 className="h5 px-3 pt-2">Pay ID : mug@09o1b867f</h5>
                                                                        </div>
                                                                        <h5 className="h5 text-center pt-5">OTP</h5>
                                                                        <Input placeholder="Enter Your OTP" type="number" className="w-100 px-3 pt-3 inputwidth" name="otp"
                                                                            value={otp} onChange={handleChange}
                                                                        /> <h4 className="text-center pt-4">Total Amount : <span className="h2 ">{(totalamountref.current).toFixed(6)} {currency}</span></h4>
                                                                    </div>
                                                                </div>
                                                                <div className="widgetbottom mx-3">
                                                                    {ButtonLoader == false ? (<Button className="swap_but newbutton mt-5" onClick={formSubmit}> Submit{button}</Button>) : (
                                                                        <Button className="swap_but newbutton">Loading</Button>)}</div>
                                                            </div></div></> : null}</div></div></section>) : (
                                        <section className="section_projec bg_trrrr w-100">
                                            <div className="container">
                                                <div className="row justify-content-center mt-5">
                                                    <div className="col-lg-4 ">
                                                        <div className="widget_content border topbg rounde-9 shadow">
                                                            <div className="widgettop pt-5">
                                                                <div width="100%"><img width="20%" src={Checkoutdetails.Logourl} className="widgetimage mx-auto d-block" />
                                                                </div>
                                                                <div className=" text-center pt-4">
                                                                    <h6 className="h3">{Checkoutdetails.Name}</h6>
                                                                    <p>{Checkoutdetails.Description}</p><p className="h5 pt-4">Total Amount</p><p className="h3 pt-2 pb-5 text-white">$ {Checkoutdetails.Fixed}</p>
                                                                    <h6 className="h5 pt-2">Secured By Beleaf</h6>
                                                                </div>
                                                            </div>
                                                            <div className="widgetbottom">
                                                                <div className="px-4">
                                                                    <div className="coin_select">
                                                                        <h5 className="heading_class_h5 px-2 pt-4 pb-2">Select currencies</h5>
                                                                        <Dropdown className="shadow" placeholder="Select currencies" fluid selection
                                                                            options={toCurrencyRef.current} onChange={handleOnChange_to} search /></div>
                                                                    {ButtonLoader == false ? (<Button className="swap_but newbutton" >Proceed{button}</Button>
                                                                    ) : (<Button className="swap_but newbutton"> Loading </Button>)}
                                                                </div>
                                                            </div>
                                                        </div></div>
                                                    <div className="col-lg-4">
                                                        <div className="widget_content border rounde-9 shadow">
                                                            <div className="widget2top bg_5445ed d-flex flex-row p-2">
                                                                <img width="15%" src={Checkoutdetails.Logourl} className="widgetimage" />
                                                                <div className=" text-center pt-3 pl-4 text-white"><h6 className="h5">{Checkoutdetails.Name}</h6></div>
                                                            </div>
                                                            <div className="widget2bottom">
                                                                <div className="px-4">
                                                                    <h5 className="heading_class_h5 px-2 text-center pt-3">Personal Information</h5>
                                                                    <div className="pt-5">
                                                                        <h5 className="heading_class_h5 px-2 pt-2">Email</h5>
                                                                        <Input placeholder="Enter Your Email" type="text" className="w-100 inputwidth" />
                                                                        <h5 className="heading_class_h5 px-2 pt-2">Payment ID</h5>
                                                                        <Input placeholder="Enter Your Pay ID" type="text" className="w-100 pb-5 inputwidth" />
                                                                        <table className="table borderless responsive">
                                                                            <tr><th className="h6 px-2 pt-2">Selected Currency </th><th className="h6 px-2 pt-2">: BTC</th></tr>
                                                                            <tr><th className="h6 px-2 pt-2 pl-3">Total Amount </th><th className="h6 px-2 pt-2 pl-3"> : 0.0024 BTC</th></tr>
                                                                        </table></div></div></div>
                                                            <div className="mx-3">
                                                                {ButtonLoader == false ? (<Button className="swap_but newbutton mt-5" >Pay Now{button}</Button>) : (
                                                                    <Button className="swap_but newbutton">Loading</Button>)}</div></div></div>
                                                    <div className="col-lg-4">
                                                        <div className="widget_content border rounde-9 topbg shadow">
                                                            <div className="widget3top p-2">
                                                                <div className="pt-5 text-white">
                                                                    <div className="text-center">
                                                                        <h5 className="h5 px-3 pt-5">Email : mugesh9902@gmail.com</h5>
                                                                        <h5 className="h5 px-3 pt-2">Pay ID : mug@09o1b867f</h5>
                                                                    </div>
                                                                    <h5 className="h5 text-center pt-5">OTP</h5>
                                                                    <Input placeholder="Enter Your OTP" type="text" className="w-100 px-3 pt-3 inputwidth" />
                                                                </div></div>
                                                            <div className="widgetbottom mx-3">{ButtonLoader == false ? (<Button className="swap_but newbutton mt-5"> Submit{button}</Button>
                                                            ) : (<Button className="swap_but newbutton">Loading...</Button>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}</>)}
                            <Modal isOpen={modal} toggle={toggle}>
                                <ModalBody className="p-5" >
                                    <h2 className="text-center text-success h1"> Payment Success !</h2>
                                    <div >
                                        <img width="20%" src={require("../Image/tick.jpg")} className="mx-auto d-block my-5" />
                                        <h3 className="text-center mb-5">Your Order has been confirmed <br /> check your email for details</h3></div>
                                    <div><Button className="text-white mx-auto d-block bg-success" onClick={goto}>Go Back</Button></div></ModalBody>
                            </Modal></main></div></div> </div></div>);
}
export default Home;