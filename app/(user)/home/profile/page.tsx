import classes from './page.module.css'
import ProfileCard from '@/components/profileCard/profile'

export default function profilePage(){
    return(
        <div className={classes.container}>
            <ProfileCard />
        </div>
    )
}