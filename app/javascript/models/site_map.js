class SiteMap{

    constructor(route_list){
        this.route_list = route_list;
        this.current_branch = [];  
    }

    updateCurrentBranch(route){
        this.current_branch = [];
        this.updateCurrentBranchRecursively(route);
        this.current_branch.reverse();
    }

    updateCurrentBranchRecursively(route){
        this.current_branch.push(route);
        let parent_path = route.getRouteOptions().parent;
        if(parent_path){
            let parent = this.findRoute(parent_path);
            this.updateCurrentBranchRecursively(parent);
        }
    }

    findRoute(path){
        return this.route_list.getRoutes().find((route) => {return route.path === path});
    }

    getRelativeRoute(relative_shift){
        let current_index = this.current_branch.length - 1;
        if(relative_shift >= 0){
            return this.current_branch[current_index];
        } else if (relative_shift <= -current_index){
            return this.current_branch[0];
        } else {
            return this.current_branch[current_index + relative_shift];
        }
    }

    getBreadCrumbs(){
        let bc_array = this.current_branch.map((route) => { return route.getBreadCrumb(); });
        return bc_array;
    }
}

export default SiteMap;