<template>
    <div :class="['fileUpload',item.controlType,{'empty_left':fileArr.length != 0}]" style="display:flex;padding:5px 0">
        <!-- <mt-field 
            label="上传图片:">
        </mt-field> -->
        <span v-if="item.displayIsVisible=='1'">{{item.controlDisplayName}}：</span>
        <!-- {{item.baseProperty.labelImage}} -->
        <img v-else-if="item.baseProperty.labelImage!=''" :src="baseURL+`research/file/downloadFile/${item.baseProperty.labelImage}`" style="height:100px;"/>
        <span v-else-if="item.baseProperty.labelImage==''"></span>
        <ul v-if="fileArr.length != 0">
            <li v-for="(item, index) in fileArr" :key="index" >
                <input v-show="!item.fileId" id="aaa" :ref="'fileInput'+index" name="file" @change="selectFile" type="file" accept='image/*'>
                <span  v-show="!item.fileId" class="icon iconfont iconjia"></span>
                <div class="pic" v-show="item.fileId"
                     :style="'background-image:url('+baseURL+`research/file/download/thumbnail/${item.fileId}`+');'"
                     @touchstart="gtouchstart(index)"
                     @touchend="gtouchend(index,item)"
                     @touchmove="gtouchmove()"
                     >
                </div>
              <!--@click="showBigImg(index,item)"-->
                <!--<img  v-show="item.fileId" :src="baseURL+`research/file/download/thumbnail/${item.fileId}`"
                      @touchstart="gtouchstart(index)"
                      @touchend="gtouchend(index,item)"
                      @touchmove="gtouchmove()">-->
                <!--<loading-image v-show="item.fileId" :src="baseURL+`research/file/download/thumbnail/${item.fileId}`"></loading-image>-->
              <!--<preview-img v-if="isShowBigImg" :imgs="imgs" :currentImg="current" @close="isShowBigImg = false"></preview-img>-->
              <image-view v-if="isShowBigImg"
                          :state="isShowBigImg"
                          ref="imageViews"
                          @on-close="onCloseView"
                          :url="imgs">
              </image-view>
            </li>
        </ul>
      <ul v-if="fileArr.length == 0" :class="[{'empty_right':fileArr.length == 0}]">
        <li>(空)</li>
      </ul>
    </div>
</template>

<script>
import { Toast,MessageBox,Indicator } from 'mint-ui';
import axios from 'axios';
// import loadingImage from './loadingImage';
// import previewImg from './previewImg';
import imageView from './imageView';
import $ from 'jquery';
export default {
    name: 'fileUpload',
    props: {
        type: {
            type: String,
            default: ""
        },
        item: {
            type: Object,
            default: () =>({})
        },
        report: {
            type: Object,
            default: () => ({})
        }
    },
  components:{
    // loadingImage,
    // previewImg,
    imageView
  },
    data () {
        return {
            fileArr:[],
            baseURL:JSON.parse(sessionStorage.getItem('serverConfig')).baseURL,
            timeOutEvent:0,
            isShowBigImg: false,
            imgs:[]
        }
    },
    methods: {
        selectFile(e) {
            let that = this;
            let files = e.target.files || e.dataTransfer.files;
            // if(files.length){
            //     let allImgExt = ['jpg','jpeg','gif','png'];
            //     let type = files[0].type.split('/')[1];
            //     if(allImgExt.indexOf(type) == -1) {
            //         Toast('请选择正确的图片类型！');
            //         return;
            //     }
            //     let filePath;
            //     let reader = new FileReader();
            //     reader.readAsDataURL(files[0]);
            //     reader.onloadend = () => {
            //         this.fileArr.unshift({
            //             url: reader.result,
            //             name: files[0].name
            //         })
            //     }
            // }
            if(files.length) {
                let regType = ['jpg','jpeg','gif','png'];
                let type = files[0].type.split('/')[1];
                if(regType.indexOf(type) == -1) {
                    Toast('请选择正确的图片类型！');
                    return;
                }
                let fd = new FormData();
                fd.append('file', files[0]);
                fd.append('crfId',this.$route.query.formCrfId);
                fd.append('patientId',this.$store.state.patientInfo.patientId);
                fd.append('reportId',this.$route.query.reportId);
                // fd.append('crfId',395);
                // fd.append('patientId','106432513131413504');
                // fd.append('reportId','2c9a80826df88c99016dfb51d7d60006');
                // fd.append('userId','4028813d6df87cb8016df87ff2160001');
                console.log('userId',that.$store.state.userInfo)
                fd.append('desc',that.item.controlDisplayName);
                fd.append('userId',that.$store.state.userInfo.userId)
                fd.append('sourceType',2);
                Indicator.open('正在上传...');
                that.fileUploadHttp(fd).then(response => {
                    // console.log(response)
                    if(response.data.code === 0) {
                        Toast({
                            message: '上传成功',
                        });
                        let reader = new FileReader();
                        reader.readAsDataURL(files[0]);
                        that.fileArr.unshift({
                            fileId:response.data.data[0].fileId,
                            fileName:response.data.data[0].fileName,
                            url:reader.result,
                            name:files[0].name,
                        })
                        // console.log(that.fileArr)
                        let copyData  = that.fileArr;
                        copyData.splice(copyData.length-1,1);
                        that.report.value2 = JSON.stringify(copyData);
                        that.fileArr.push({})
                    }
                  Indicator.close()
                });
              Indicator.close()
            }
        },
        deletePic(index) {
            MessageBox.confirm('是否删除这张图片?').then(action => {
                if(action) {
                    this.fileArr.splice(index,1)
                    console.log(this.fileArr);
                    let copyData  = this.fileArr;
                    copyData.splice(copyData.length-1,1);
                    this.report.value2 = JSON.stringify(this.fileArr);
                    this.fileArr.push({})
                }
            }).catch(err => {
                console.log(err);
            })
            // console.log(this.fileArr)
        } ,
        //自定义多文件文件上传接口
        fileUploadHttp(param) {
            let http = JSON.parse(sessionStorage.getItem('serverConfig')).baseURL;
            let url = http+'research/mobile/cases/save/singleFile.do';
            return axios.post(url,param,{
                headers: {"content-type": "multipart/form-data"}
            })
        },
        //测试 图片图片上传的 bug
        upload(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length){
                return;
            } 
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            console.log(reader.readAsDataURL(files[0]))
        },
        gtouchstart(index) {
          console.log('2222');
          let that = this;
          clearTimeout(this.timeOutEvent);//清除定时器
          that.timeOutEvent = 0;
          this.timeOutEvent = setTimeout(function(){
            //执行长按要执行的内容，
            // console.log('触发删除');
            that.timeOutEvent = 0;
            that.deletePic(index);
          },600);//这里设置定时
        },
        gtouchend(index,item){
          let that = this;
          clearTimeout(that.timeOutEvent);
          if(that.timeOutEvent!=0){
            //这里写要执行的内容（尤如onclick事件）
            // console.log('触发图片预览操作')
            that.showBigImg(index,item)
          }else if(that.timeOutEvent == 0) {
            // console.log('触发删除操作');
          }
        },
        //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
        gtouchmove(){
          let that = this;
          clearTimeout(that.timeOutEvent);//清除定时器
          that.timeOutEvent = 0;
        },
        showBigImg(index,item) {
          if(JSON.stringify(item)!== '{}') {
            this.imgs[0] = this.baseURL+`research/file/downloadFile/${item.fileId}`;
            this.isShowBigImg = true;
            this.$nextTick(()=>{
              this.$refs.imageViews[0].show();
            });
          }
        },
        onCloseView(data) {
          this.isShowBigImg = data;
        },
    },
    mounted() {
        // console.log(this.report.value2);
        // this.fileArr.push({});
        if(this.report.value2) {
            this.fileArr = JSON.parse(this.report.value2);
            //兼容PC 端移动上传
            // this.fileArr.push({})
        }
    }
}
</script>
<style lang="scss" scoped>
    .fileUpload {
        ul {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            padding:0 5px;
            li{
                position: relative;
                width: 60px;
                height: 60px;
                margin: 5px;
                /*border: 1px solid #ccd0d4;*/
                overflow: hidden;
                input {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    width: 90%;
                    // height: 93%;
                    opacity: 0;
                    z-index: 2;
                    border-radius: 2.5px;
                }
                span.icon{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%,-50%);
                    text-align: center;
                    line-height: 60px;
                    border-radius: 2.5px;
                    font-size: 30px;
                    color: rgba(204, 208, 212, 1);
                    background:rgba(204,208,212,0.2);
                }
                .pic {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    transform: translate(-50%,-50%);
                    background-size: 100% 100%;
                    border:1px solid #D5D5D5;
                    border-radius: 2.5px;
                    background-repeat:no-repeat;
                }
              .close-btn{
                position: absolute;
                top: -22px;
                right: -5px;
                color: #DB5452;
              }
              img{
                height: 100%;
                width: 100%;
              }
            }
        }
    }
</style>
