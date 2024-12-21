import * as cdk from "aws-cdk-lib";
import { FunctionUrlOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Construct } from "constructs";
import { CloudFront } from "./constructs/cloudfront";
import { Lambda } from "./constructs/lambda";

export class CloudfrontLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, "Lambda");
    const origin = new FunctionUrlOrigin(lambda.functionUrl);

    const cloudfront = new CloudFront(this, "CloudFront", {
      origin,
    });

    new cdk.CfnOutput(this, "Endpoint", {
      value: cloudfront.distribution.distributionDomainName,
    });
  }
}
