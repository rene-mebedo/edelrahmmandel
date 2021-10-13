import React, { Fragment, useEffect } from 'react';

import Spin from 'antd/lib/spin';

import { LoginForm } from '/imports/ui/LoginForm';
import { SiteLayout } from '/imports/ui/SiteLayout';
import { useAccount, useRoles } from '../client/trackers';
import { useAppState } from '../client/AppState';



export const App = ({content, refOpinion, refDetail, activeMenuKey, ...props}) => {
    const { currentUser, isLoggedIn, accountsReady } = useAccount();
    const { roles, rolesLoading } = useRoles();

    const [ appIsBusy ] = useAppState('appIsBusy');

    var keys = {37: 1, 38: 1, 39: 1, 40: 1, 27:1, 83:1, 115:1 };

    function preventDefault(e) {
        if (appIsBusy) {
            console.log('preventDefault', appIsBusy)
            e.preventDefault();
        }
    }

    function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
    }

    // modern Chrome requires { passive: false } when adding event
    var supportsPassive = false;
    try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; } 
    }));
    } catch(e) {}

    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    function disableScrollWhenBusy() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
        document.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    // call this to Enable
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        document.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }

    useEffect(() => {
        const reactRoot = document.getElementById('react-root');
        
        // add done for the initial loading
        reactRoot.classList.add('done');

        disableScrollWhenBusy();

        return () => {
            enableScroll();
        }
    }, [appIsBusy]);

    if (!accountsReady) {
        return <Spin size="large" />
    }

    if (!props.authenticatedRoute) {
        return React.createElement(content, { ...props });
    }

    if (!isLoggedIn) {
        return <LoginForm />
    }

    /*const avoidUserActionWhenBusy = e => {
        console.log('scroll');
        if (appIsBusy) {
            e.preventDefault();
            e.stopPropagation();
        }
    }*/

    return (
        <Fragment>
            <div className="mbac-busy-action" style={{display:appIsBusy?'block':'none'}} /*onScroll={avoidUserActionWhenBusy}*/>
                <div className="mbac-loading-spinner">
                    <div style={{margin:32,padding:32,backgroundColor:'orange',borderRadius:500,border:'20px solid black'}}>
                        <Spin size="large" style={{marginLeft:16}}/>
                        <br/>
                        <span>{appIsBusy}</span>
                    </div>
                </div>
            </div>

            <SiteLayout 
                activeMenuKey={activeMenuKey}
                refOpinion={refOpinion}
                refDetail={refDetail}
                currentUser={currentUser}
            >
                {
                    //content || null
                    React.createElement(content || null, { refOpinion, refDetail, currentUser })
                }
            </SiteLayout>
        </Fragment>
    );
}   