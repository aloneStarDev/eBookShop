import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { response, setJwt } from '../Redux/RequestSlice';
import { setUser } from '../Redux/UserSlice';

function RequestAdaptor() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const request = useSelector(state => state.request)
    const dispatch = useDispatch()
    const navigate = useNavigate();
    useEffect(() => {
        if (request != null && request.route !== "") {
            let options = {
                method: request.method,
                headers: {
                    "content-type": "application/json"
                }
            };
            if (request.auth) {
                options.headers.Authorization = request.jwt;
            }
            options.body = request.data ? JSON.stringify(request.data) : '';
            fetch(request.route, options)
                .then(res => res.json())
                .then(res => {
                    let snackbar_key = 0;
                    dispatch(response(res));
                    switch (request.route) {
                        case "/api/user/login":
                            if (res.ok) {
                                snackbar_key = enqueueSnackbar("welcom", { variant: "success" });
                                dispatch(setJwt(res.data));
                                navigate("/");
                            }
                            else
                                snackbar_key = enqueueSnackbar(res.error, { variant: "error" });
                            break;
                        case "/api/user/register":
                            if (res.ok) {
                                snackbar_key = enqueueSnackbar("verify your mail address", { variant: "info" });
                                dispatch(setUser(request.data));
                            }
                            else
                                snackbar_key = enqueueSnackbar(res.error, { variant: "error" });
                            break;
                        case "/api/user/verify":
                            if (res.ok) {
                                snackbar_key = enqueueSnackbar("your account verified successfully", { variant: "success" });
                                setTimeout(() => {
                                    navigate("/login");
                                }, 4000);
                            }
                            else
                                snackbar_key = enqueueSnackbar(res.error, { variant: "error" });
                            break;
                        default:
                            break;
                    }
                    if (snackbar_key !== 0)
                        setTimeout(() => {
                            closeSnackbar(snackbar_key);
                        }, 3000);

                })
                .catch(e => console.log(e));
        }
    }, [request.route, request.data])
    return (null);
}

export default RequestAdaptor;