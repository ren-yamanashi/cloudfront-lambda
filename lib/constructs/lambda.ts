import {
  FunctionUrlAuthType,
  IFunctionUrl,
  LoggingFormat,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export class Lambda extends Construct {
  public readonly functionUrl: IFunctionUrl;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const lambda = new NodejsFunction(this, "LambdaHandler", {
      entry: path.join(__dirname, "../../src/index.ts"),
      runtime: Runtime.NODEJS_20_X,
      loggingFormat: LoggingFormat.JSON,
    });

    this.functionUrl = lambda.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: { allowedOrigins: ["*"] },
    });
  }
}
