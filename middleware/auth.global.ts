import {isUserSignedIn} from "../composables/auth"
export default defineNuxtRouteMiddleware((to, from) => {
    // isAuthenticated() is an example method verifying if a user is authenticated
    console.log("middleware")

    isUserSignedIn().then((userStatus:any)=>{
        console.log(userStatus)
        if (!userStatus) {
            return navigateTo('/login')
        }
    })
})