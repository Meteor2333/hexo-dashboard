import {ElMessage} from "element-plus";
import axios from "axios";
import router from "@/router";

axios.defaults.headers["Content-Type"] = "application/json";
const service = axios.create({"baseURL": "./api", "timeout": 100000});

service.interceptors.response.use(
    (res) => {
        if (
            res.request.responseType === "blob" ||
            res.request.responseType === "arraybuffer"
        ) {
            return res.data;
        }
        const code = res.data.code;
        if (!code) return res.data;

        const msg = res.data.data || res.data.msg || `Error: ${code}`;

        ElMessage.error(msg);

        if (code === 401) {
            router.replace({"path": "/login"});
            throw new Error("Illegal login");
        }
        return res.data;
    }, ({message}) => {
        ElMessage.error(message);
        return {"code": -1};
    },
);

export default service;
