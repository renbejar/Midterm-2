var app = new Vue({
  el: '#app',
 data: {
    items: [],
  },
    methods: {
      async getItems() {
  try {
      let response = await axios.get("/api/items");
      this.items = response.data;
      return this.items.sort((a, b) => {
            var rval = 0;
            if(a.title > b.title) {
                rval = 1;
            } else if(a.title < b.title) {
                rval = -1;
            }
            return(rval);
        })
      return true;
    } catch (error) {
      console.log(error);
    }
    
  },
  selectItem(item){
    let response = axios.put("/api/items/" + item._id);
  },
  ordered(item){
      console.log("here");
      let response = axios.put("/api/items/" + item._id + "/ordered");
  },
  },
    created() {
    this.getItems();
  },
});
