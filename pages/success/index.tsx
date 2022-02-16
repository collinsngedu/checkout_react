import { Button } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";


const SuccessPage: NextPage = () => {
    const router = useRouter()

    const refund = async () => {

        try {
            let refundToken

            if (router.query["token"] != null) {
                refundToken = router.query["token"]
            } else if (router.query["cko-session-id"] != null) {
                refundToken = router.query["cko-session-id"]
            } else {
                throw "token not found"
            }

            if (refundToken != null) {
                const reqData = { "data": { "token": refundToken, amount: 1 } }
                const res = await fetch("http://localhost:5001/test-7194e/us-central1/refund", {
                    method: "POST", body: JSON.stringify(reqData), headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                const resJson = await res.json()

                if (resJson.result.status == "refund_success") {
                    alert("Refund Successfully")
                } else {
                    throw resJson.error
                }
            }
        } catch (err) {
            alert(err)
        }




    }



    return (
        <>
            <h2>Success</h2>

            <Button variant="contained" style={{ backgroundColor: "#8C9E6E" }} onClick={() => {
                refund()
            }}>Process Payment</Button>
        </>
    )
}

export default SuccessPage


