<template>
<div class="ordermanage">
  <el-input  placeholder="请输入关键字" icon="search"  class="search"  v-model="search" ></el-input>
  <el-table
    :data="tables"
    :default-sort = "{prop: 'date', order: 'descending'}"
    style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="medscope">
          <table id="rounded" style="width: 100%">
    <thead>
    	<tr>
        	<th scope="col" class="MedName1"> 药品名称</th>
          <th scope="col" class="MedNm1"> 数量</th>
          <th scope="col" class="MedName2"> 药品名称</th>
          <th scope="col" class="MedNm2"> 数量</th>
          <th scope="col" class="MedName3"> 药品名称</th>
          <th scope="col" class="MedNm3"> 数量</th>
          <th scope="col" class="MedName4"> 药品名称</th>
          <th scope="col" class="MedNm4"> 数量</th>
      </tr>
    </thead>
    <tbody>
    	<tr v-for="item in medscope.row.med" :key="item.id">
        	<td> {{item.medname1}} </td>
          <td> {{item.count1}} </td>
          <td> {{item.medname2}} </td>
          <td> {{item.count2}} </td>
          <td> {{item.medname3}} </td>
          <td> {{item.count3}} </td>
          <td> {{item.medname4}} </td>
          <td> {{item.count4}} </td>
      </tr>
    </tbody>
</table>
      </template>
    </el-table-column>

    <el-table-column
      type="index"
      :index="indexMethod">
    </el-table-column>
    <el-table-column
      label="名字"
      prop="patient">
    </el-table-column>
    <el-table-column
      label="数量"
      prop="dose">
    </el-table-column>
    <el-table-column
      label="总价"
      prop="total">
    </el-table-column>
    <el-table-column
      prop="date"
      label="日期"
      sortable>
    </el-table-column>
    <el-table-column
        label="操作"
        align="center"
        width="300">
        <template slot-scope="scope">
            <el-button  size="small" type="success" v-if='scope.row.editable' @click="outdb(scope.row)" round>出库</el-button>
            <el-button type="danger" size="small" v-if='scope.row.editable' @click="deleteDate(scope.row['_id'])" round>删除</el-button>
            <el-button type="primary" size="small" v-if='!scope.row.editable' @click="reUes(scope.row)" round>重用</el-button>
        </template>
        </el-table-column>
  </el-table>
</div>
</template>

<script>
  export default {
    data: function() {
      return {
        tableData5: [],
        medtable: [],
        search: ''
      }
    },
    
    computed:{
      tables:function(){
        var search=this.search;
        if(search){
          return  this.tableData5.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData5;
      }
    },

    methods: {
      indexMethod(index) {
        return index + 1;
      },

      addInventory: function() {
        //todo
      },

      getAll: function() {
        this.loading = true;
        this.$http.get("/ordapi/order").then(
          function(response) {
            this.loading = false;
            this.tableData5 = response.body;
          },
          function() {
            this.loading = false;
            console.log("error");
          }
        );
      },

    updateOrdStauts: function(id) {
        var ordId = id;
        this.$http.put(`/ordapi/updateOrdstatus/${ordId}`).then(
          function(response) {
            if (response.ok) {
              this.$message({
              message: "订单确认成功",
              type: "success",
            });
            }
          },
          function() {
            this.loading = false;
            console.log("update error");
          }
        );
      },

      outdb: function(row) {
        let temp = {
            medary: row.med,
            dose: row.dose
        }
        //alert(temp instanceof Array);
        //alert(temp[0].medname);
        var that = this;

        this.$confirm("此操作将确认订单且将订单出库,后续无法对订单更改，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
        })
        .then(() => {
          this.$http.put('/ordapi/order', temp).then(
            function(response) {
              if (response.ok) {
                this.$message({
                  type: "success",
                  message: "订单确认成功!"
                });
                that.updateOrdStauts(row['_id']);
                that.getAll();
              } else {
                this.$message({
                  type: "error",
                  message: "订单确认失败!"
                });
              }
            },
            function() {
              // this.loading = false;
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
      },

      reUes: function(row) {
        let tempOrder = {
          med: row.med,
          patient: row.patient,
          dose: row.dose,
          total: row.total,
          totalprofit: row.totalprofit
        }
        this.$store.dispatch("setOrderToVuex",tempOrder);
        this.$router.push('CreateOrd');
      },
    
      deleteDate: function(id) {
      var that = this;
      var deleteId = id;

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`/ordapi/order/${deleteId}`).then(
            function(response) {
              if (response.ok) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                that.getAll();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            },
            function() {
              // this.loading = false;
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      }
    },

    //页面初始化进来查询数据
    mounted: function() {
      this.getAll();
    }
  };
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  
</style>