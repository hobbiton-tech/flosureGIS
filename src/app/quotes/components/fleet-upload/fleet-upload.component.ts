import { Component, OnInit } from '@angular/core';
import { RiskModel } from '../../models/quote.model';
import { UploadChangeParam, NzMessageService } from 'ng-zorro-antd';
import * as XLSX from 'xlsx';

type AOA = any[][];

@Component({
    selector: 'app-fleet-upload',
    templateUrl: './fleet-upload.component.html',
    styleUrls: ['./fleet-upload.component.scss']
})
export class FleetUploadComponent implements OnInit {
    constructor(private msg: NzMessageService) {}

    // risk upload modal
    isVisible = false;

    /*name of the risks template that will be downloaded. */
    fileName = 'Risks_template.xlsx';
    fileLocation: string;

    //
    data: AOA = [
        [1, 2],
        [3, 4]
    ];
    wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };

    risks: RiskModel[] = [];

    ngOnInit(): void {}

    // what happens when a file is uploaded
    handleChange({ file }: UploadChangeParam): void {
        const status = file.status;

        // when file is uploading
        if (status !== 'uploading') {
            // console.log(file);
            //
        }

        // when file is done uploading
        if (status === 'done') {
            this.msg.success(`${file.name} file uploaded successfully.`);
            this.fileLocation = file.response.Location;
            console.log(this.fileLocation);
            this.isVisible = false;

            // get uploaded excel file and convert it to array
            // XMLHttpRequest
            const oReq = new XMLHttpRequest();
            oReq.open('GET', this.fileLocation, true);
            oReq.responseType = 'arraybuffer';

            oReq.onload = () => {
                const arraybuffer = oReq.response;

                // //convert data to binary string
                const data = new Uint8Array(arraybuffer);
                const arr = new Array();
                for (let i = 0; i !== data.length; ++i) {
                    arr[i] = String.fromCharCode(data[i]);
                }
                const bstr = arr.join('');

                // call XLSX
                const workbook = XLSX.read(bstr, { type: 'binary' });
                workbook.SheetNames.forEach(sheetName => {
                    const imported_risks: RiskModel[] = XLSX.utils.sheet_to_json(
                        workbook.Sheets[sheetName]
                    );
                    this.risks = imported_risks;
                });
            };

            oReq.send();

            // when there is an error during upload
        } else if (status === 'error') {
            this.msg.error(`${file.name} file upload failed.`);
        }
    }

    handleCancel(): void {
        this.isVisible = false;
    }

    handleDownloadTemplate() {
        const headings = [
            [
                'insuranceType',
                'registrationNumber',
                'vehicleMake',
                'vehicleModel',
                'engineNumber',
                'chassisNumber',
                'color',
                'productType',
                'sumInsured',
                'netPremium'
            ]
        ];
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(headings);

        // const element = document.getElementById('risksTemplateTable');
        // const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
}
