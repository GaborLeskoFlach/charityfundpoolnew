import {observable, action} from 'mobx';

export class ImageUploadController {

    constructor() {
        this.file = '';
        this.imagePreviewUrl = '';
    }

    @observable file : any;
    @observable imagePreviewUrl : string;

    @action("Upload an image")
    setImageToUpload = action((file : any, imagePreviewUrl : string) => {
        this.file = file;
        this.imagePreviewUrl = imagePreviewUrl;        
    })

}
