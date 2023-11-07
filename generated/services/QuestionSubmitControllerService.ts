/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_long_ } from '../../generated/models/BaseResponse_long_';
import type { BaseResponse_Page_QuestionSubmitVO_ } from '../../generated/models/BaseResponse_Page_QuestionSubmitVO_';
import type { BaseResponse_QuestionRunResult_ } from '../../generated/models/BaseResponse_QuestionRunResult_';
import type { QuestionRunRequest } from '../../generated/models/QuestionRunRequest';
import type { QuestionSubmitAddRequest } from '../../generated/models/QuestionSubmitAddRequest';
import type { QuestionSubmitQueryRequest } from '../../generated/models/QuestionSubmitQueryRequest';

import type { CancelablePromise } from '../../generated/core/CancelablePromise';
import { OpenAPI } from '../../generated/core/OpenAPI';
import { request as __request } from '../../generated/core/request';

export class QuestionSubmitControllerService {

    /**
     * doQuestionSubmit
     * @param questionSubmitAddRequest questionSubmitAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doQuestionSubmitUsingPost(
questionSubmitAddRequest: QuestionSubmitAddRequest,
): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/do',
            body: questionSubmitAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listQuestionSubmitByPage
     * @param questionSubmitQueryRequest questionSubmitQueryRequest
     * @returns BaseResponse_Page_QuestionSubmitVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listQuestionSubmitByPageUsingPost(
questionSubmitQueryRequest: QuestionSubmitQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSubmitVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/list/page',
            body: questionSubmitQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * doQuestionRun
     * @param questionRunRequest questionRunRequest
     * @returns BaseResponse_QuestionRunResult_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doQuestionRunUsingPost(
questionRunRequest: QuestionRunRequest,
): CancelablePromise<BaseResponse_QuestionRunResult_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/run',
            body: questionRunRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
