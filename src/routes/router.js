import React from "react"

import Path from "./path"
import {Welcome} from "../components/Welcome.js"
import {Main} from "../components/Main"
import {CreateJob} from "../components/CreateJob"

const routes = [
    { path: Path.WELCOME, element: <Welcome /> },
    { path: Path.MAIN, element: <Main /> },
    { path: Path.HOME, element: <Welcome /> },
    { path: Path.CREATE_JOB, element: <CreateJob /> }
]

export default routes