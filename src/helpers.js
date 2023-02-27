import { useEffect } from "react";

export function isLoggedIn(){
  if (document.cookie.includes('XSRF-TOKEN')){
    return true;
  };
  return false;
}

export function getCookie(cookieName){
  let cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    if(cookie.includes(cookieName)) {
      return cookie.split('=')[1];
    }
  }
  return null;
}

export function deleteCookie(cookieName) {
  document.cookie = cookieName +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
} 

export function useOutsideCallback(ref, callback) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            callback()
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

function hexToDec(hexString){
  return parseInt(hexString, 16);
}

export function colorPalleteMaker(num) {
  let max = hexToDec('FFFFFF');
  let pallete = [];
  for (let index = 0; index < num; index++) {
    const element = "#" + Math.floor(Math.random() * max).toString(16)
    pallete.push(element);
  }
  return pallete
}