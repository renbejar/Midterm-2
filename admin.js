var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    items: [],
    price: '',
    path: "",
    findTitle: "",
    findItem: null,
    file: null,
    addItem: null,
  },
  created: function(){
        this.getItems()
    },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0];
    },
    async upload() {
      try {
        //const formData = new FormData();
        //formData.append('photo', this.file, this.file.name)
        //let r1 = await axios.post('/api/photos', formData);
        let r1 = await axios.post('/api/items', {
          title: this.title,
          path: this.path,
          price: this.price,
        });
        console.log(r1.data);
        this.addItem = r1.data;
      } catch (error) {
        console.log(error);
      }
      this.getItems();
    },
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
 selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        let response = axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
       async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          description: this.findItem.description,
        });
        this.findItem = null;
        this.getItems();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getItems();
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    },
   /* sortedItems() {
        return this.comments.sort((a, b) => {
            var rval = 0;
            if(a.upvotes < b.upvotes) {
                rval = 1;
            } else if(a.upvotes > b.upvotes) {
                rval = -1;
            }
            return(rval);
        })
    }*/
  },
});
