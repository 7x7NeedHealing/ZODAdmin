    
<template>
    <div class="container">
        <div class="tile">
            <div class="tile-header">
                <h2
                    style="color: white; opacity: .75; font-size: 4rem; display: flex; justify-content: center; align-items: center; height: 100%;">
                    SIGN IN</h2>
            </div>

            <div class="tile-body">
                <form id="form">
                    <label class="form-input">
                        <i class="material-icons">person</i>
                        <input type="text" autofocus="true" required v-model="account" />
                        <span class="label">Account</span>
                        <span class="underline"></span>
                    </label>

                    <label class="form-input">
                        <i class="material-icons">lock</i>
                        <input type="password" required v-model="password" />
                        <span class="label">Password</span>
                        <div class="underline"></div>
                    </label>

                    <div class="submit-container clearfix" style="margin-top: 2rem;">
                        <div id="submit" role="button" type="button" class="btn btn-irenic float-right" tabindex="0"
                            @click="signin()">
                            <span>SIGN IN</span>
                        </div>

                        <div class="login-pending">
                            <div class=spinner>
                                <span class="dot1"></span>
                                <span class="dot2"></span>
                            </div>

                            <div class="login-granted-content">
                                <i class="material-icons">done</i>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import router from '../router';
let account = ref('');
let password = ref('');

const signin = () => {
    // console.log('...');

    axios.get('http://localhost:888/adminLogin?account=' + account.value + '&password=' + password.value)
        .then(() => {
            axios.get('http://localhost:888/getToken?account=' + account.value)
                .then((res) => {
                    localStorage.setItem('token', res.data.token);
                    // location.reload();
                    router.push('/');
                })
                .catch((err) => {
                    console.log(err);

                })

        })
        .catch((err) => {
            console.log(err);

        })
}
</script>
    
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i|Monoton');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

$colors: (
    irenic: #07beb8,
    serene: #3dccc7,
    tranquil: #68d8d6,
    calm: #9ceaef,
    cool: #c4fff9,
    ice: #ffffff,

    base: #454749
);

@function color($key: "calm") {
    @return map-get($colors, $key);
}

* {
    box-sizing: border-box;
}

html {
    font-size: 14px;
}

body {
    background: linear-gradient(to bottom, color("tranquil"), color("ice"));
    color: color("base");
    display: flex;
    align-items: center;
    justify-content: center;
    font-family:
        'Source Sans Pro',
        sans-serif;
    min-height: 100vh;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: Monoton, sans-serif;
    margin-bottom: .5rem;
}

.container {
    width: 1903px;
    height: 837px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/**
 * Tiles
 */

.tile {
    background-color: color("ice");
    border-radius: .1rem;
    box-shadow: 0 .75rem 1.5rem rgba(0, 0, 0, 0.2), 0 .25rem .25rem rgba(0, 0, 0, 0.2);
    position: relative;
    width: 100%;
    min-width: 320px;
    max-width: 24rem;
    overflow: hidden;
    margin: 0 auto;

    .tile-header {
        background-image: url('https://res.cloudinary.com/dgmilxzy7/image/upload/c_scale,w_500,o_75,b_rgb:07beb8/v1506735375/CodePen/ViddenPixel.jpg');
        background-position: center;
        background-size: cover;
        height: 12rem;
    }

    .tile-body {
        padding: 2rem;
    }
}

/**
 * Forms
 */

.form-input {
    $form-margin-bottom: 1rem;
    $label-font-size: 1rem;
    $label-font-size-focus: .85rem;
    $label-icon-spacing: 2.25rem;
    $input-padding-top: 1.5rem;
    $input-padding-right: 0;
    $input-padding-bottom: .5rem;
    $input-padding-left: 0;
    $input-underline-color: #868e96;
    $input-underline-color-focus: color("irenic");

    display: block;
    position: relative;
    margin-bottom: $form-margin-bottom;

    &>.material-icons {
        position: absolute;
        font-size: 1.5rem;
        top: 1.2rem;

        &~input,
        &~.label,
        &~.underline {
            margin-left: $label-icon-spacing;
            width: calc(100% - #{$label-icon-spacing});
        }
    }

    input {
        border: none;
        box-shadow: none;

        padding: {
            top: $input-padding-top;
            right: $input-padding-right;
            bottom: $input-padding-bottom;
            left: $input-padding-left;
        }

        ;
        outline-style: none;
        width: 100%;

        &~.label {
            color: $input-underline-color;
            font-size: $label-font-size;
            margin: 0;
            pointer-events: none;
            position: absolute;
            top: $input-padding-top;
            left: $input-padding-left;
            transition: top .2s, font .2s;
            z-index: 1;
        }

        &~.underline {
            background-color: lighten($input-underline-color, 20%);
            height: 1px;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
        }

        &:hover,
        &:focus {
            &~.underline {
                background-color: $input-underline-color-focus;
            }

            &~.label {
                color: $input-underline-color-focus;
            }
        }

        &:focus {
            &~.underline {
                height: 2px;
            }
        }

        &:focus,
        &:valid {
            &~.label {
                top: 0;
                font-size: $label-font-size-focus;
            }
        }

        &:-webkit-autofill {
            &~.label {
                top: 0;
                font-size: $label-font-size-focus;
            }
        }
    }
}


/**
 * Buttons
 */

@mixin btn-variant($background-color) {
    background-color: $background-color;
    color: white;

    &:hover,
    &:focus,
    &:active {
        background-color: darken($background-color, 5%);
    }
}

.btn {
    $btn-padding-x: 1rem;
    $btn-padding-y: .5rem;

    border-radius: .2rem;
    display: inline-block;

    padding: {
        top: $btn-padding-y;
        right: $btn-padding-x;
        bottom: $btn-padding-y;
        left: $btn-padding-x;
    }

    ;
}

.btn,
[role="button"],
[type="button"] {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
}

@each $color,
$value in $colors {
    .btn-#{$color} {
        @include btn-variant($value);
    }
}

/**
 * Utilities
 */
.clearfix:after {
    content: "";
    display: table;
    clear: both;
}

.float-right {
    float: right;
}




/**
 *
 */
.submit-container {
    position: relative;

    #submit {
        position: relative;
        z-index: 2;
        outline: none;
        opacity: 1;
        transition: transform .1s ease-in, opacity .1s ease-in, border-radius .1s ease-in;
        right: -1px;

        span {
            opacity: 1;
            transition: opacity .1s ease-in;
        }

        &.pending {
            transform: scale(0.55, 1.5);
            background-color: color("irenic");
            border-radius: 50%;
            opacity: 1;

            span {
                opacity: 0;
            }

            &~.login-pending {
                opacity: 1;
                transform: scale(1, 1);
                z-index: 3;
            }
        }

        &.granted {
            &~.login-pending {
                opacity: 1;
                transform: translate(-9rem, -11rem) scale(18, 18);
                z-index: 3;

                .spinner {
                    opacity: 0;
                }

                .login-granted-content {
                    opacity: 1;
                }
            }
        }
    }

    .login-pending {
        height: 3rem;
        width: 3rem;
        background-color: color('irenic');
        position: absolute;
        border-radius: 50%;
        right: 1rem;
        bottom: -0.5rem;
        opacity: 0;
        overflow: hidden;
        transform: translate(0, 0) scale(0.5, 0.5);
        transition: transform .2s ease-in, scale .2s ease-in;
        z-index: 1;

        .login-granted-content {
            background-image: url(https://res.cloudinary.com/dgmilxzy7/image/upload/c_scale,w_700,o_25,b_rgb:07beb8/v1506735375/CodePen/ViddenPixel.jpg);
            background-position: center;
            background-size: cover;
            color: color("ice");
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            width: 100%;
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            transition: opacity .2s ease-in .2s;
            text-shadow: 0px 0px 20px color("ice");

            .material-icons {
                font-size: 5px;
                position: relative;
                left: 1.25px;
            }
        }
    }
}

.spinner {
    width: 3rem;
    height: 3rem;

    position: relative;
    margin: 0 auto;

    .dot1,
    .dot2 {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: color("tranquil");
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;

        -webkit-animation: dot-bounce 2.0s infinite ease-in-out;
        animation: dot-bounce 2.0s infinite ease-in-out;
    }

    .dot2 {
        -webkit-animation-delay: -1.0s;
        animation-delay: -1.0s;
    }

    @-webkit-keyframes dot-bounce {

        0%,
        100% {
            -webkit-transform: scale(0.0)
        }

        50% {
            -webkit-transform: scale(1.0)
        }
    }

    @keyframes dot-bounce {

        0%,
        100% {
            transform: scale(0.0);
            -webkit-transform: scale(0.0);
        }

        50% {
            transform: scale(1.0);
            -webkit-transform: scale(1.0);
        }
    }
}
</style>
