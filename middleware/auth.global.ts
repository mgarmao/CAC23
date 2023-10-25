import {isUserSignedIn} from "../composables/auth"
export default defineNuxtRouteMiddleware((to, from) => {
    isUserSignedIn().then((userStatus:any)=>{
        if (!userStatus&&(to.fullPath!="/signup")) {
            return navigateTo('/login')
        }
    })
})