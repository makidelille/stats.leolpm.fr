angular.module("statsApp.core",[])
.constant('states', function(){
    var statesNames = ["home", "global", "historique", "export"];
    return statesNames.map(function(state){
        return {
            name: state,
            state: state,
            label: state,
            component: state,
            url: "/" + state
        }
    });


    // {
    //     name:"home",
    //     state:"home",
    //     label: "home",
    //     url:"/home",
    //     component: "home"
    // },
    // {
    //     name:"global",
    //     state:"global",
    //     label: "global",
    //     url:"/global",
    //     component: "global"
    // },
    // {
    //     name:"historique",
    //     state:"historique",
    //     label: "historique",
    //     url:"/historique",
    //     component: "historique"
    // },
    // {
    //     name:"export",
    //     state:"export",
    //     label: "export",
    //     url:"/export",
    //     component: "export"
    // }
})
