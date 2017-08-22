

export function isResponseSuccess(response, toastError = false) {
    if(response == null) return false;
    if(response.ret == '0') {
        return true;
    } else {
        if(toastError) {
            wx.showToast({
                title : response.errcode + ":" + response.errstr,
                icon : 'loading'
            })
        }
    }
    return false;
}