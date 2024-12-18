import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CloudFront } from "./constructs/cloudfront";
import { Lambda } from "./constructs/lambda";

export class CloudfrontLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new Lambda(this, "Lambda");

    const cloudfront = new CloudFront(this, "CloudFront", {
      functionUrl: lambda.functionUrl,
    });

    new cdk.CfnOutput(this, "Endpoint", {
      value: cloudfront.distribution.distributionDomainName,
    });
  }
}
