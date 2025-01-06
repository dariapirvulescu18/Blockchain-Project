import React from "react"

import Path from "./path"
import {Welcome} from "../components/Welcome.js"
import {Main} from "../components/Main"
import {CreateJob} from "../components/CreateJob"
import {SelectApplicant} from "../components/SelectApplicant"
import {InspectAccount} from "../components/InspectAccount"

const routes = [
    { path: Path.WELCOME, element: <Welcome /> },
    { path: Path.MAIN, element: <Main /> },
    { path: Path.HOME, element: <Welcome /> },
    { path: Path.CREATE_JOB, element: <CreateJob /> },
    { path: Path.SELECT_APPLICANT, element: <SelectApplicant /> },
    { path: Path.INSPECT_ACCOUNT, element: <InspectAccount /> }
]

export default routes