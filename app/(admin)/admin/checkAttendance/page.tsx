import classes from './page.module.css'

export default function CheckAttendancePage(){
    return(
        <div>
            <div>Scan the face</div>
            <div className={classes.container}>
                <div className={classes.blackbox}></div>
                <div>
                    <div>
                        Please set camera to the face
                    </div>
                    <div className={classes.button}>
                        capture
                    </div>
                </div>
            </div>
            <div >
                <div>Check infomation</div>
                <div className={classes.container}>
                    <div className={classes.blackbox}></div>
                    <div>
                        <div>name</div>
                        <div>id</div>
                        <div>classes</div>
                    </div>
                </div>
            </div>
            <div className={classes.button}>
                confirm
            </div>
        </div>
    )
}